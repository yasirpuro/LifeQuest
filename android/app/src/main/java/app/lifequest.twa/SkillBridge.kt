package app.lifequest.twa

import android.content.Context
import org.json.JSONObject

/**
 * SkillBridge: küçük yardımcı. JS tarafı SharedPreferences'a `lifequest_skills_v1` anahtarı ile
 * JSON string yazmalıdır. Bu sınıf native widget tarafında bu JSON'u okuyup parse eder.
 */
object SkillBridge {
    private const val PREFS = "lifequest_prefs"
    private const val KEY = "lifequest_skills_v1"

    data class SkillSummary(val skillId: String, val mastery: Int, val nextDueIso: String?)

    fun getFocusSkill(context: Context): SkillSummary? {
        // Try dedicated prefs
        var raw: String? = null
        try {
            val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            raw = prefs.getString(KEY, null)
        } catch (e: Exception) { /* ignore */ }
        // Fallback: default shared preferences
        if (raw == null) {
            try {
                val default = androidx.preference.PreferenceManager.getDefaultSharedPreferences(context)
                raw = default.getString(KEY, null)
            } catch (e: Exception) { /* ignore */ }
        }
        // Fallback: file in app files dir
        if (raw == null) {
            try {
                val f = java.io.File(context.filesDir, "$KEY.json")
                if (f.exists()) raw = f.readText()
            } catch (e: Exception) { /* ignore */ }
        }
        if (raw == null) return null
        try {
            val obj = JSONObject(raw)
            // choose overdue or lowest mastery
            var best: SkillSummary? = null
            val now = System.currentTimeMillis()
            val keys = obj.keys()
            while (keys.hasNext()) {
                val k = keys.next()
                val entry = obj.getJSONObject(k)
                val mastery = entry.optInt("mastery", 0)
                val nextDue = entry.optString("nextDue", null)
                val nextDueTs = if (nextDue.isNullOrEmpty()) Long.MAX_VALUE else try { java.time.Instant.parse(nextDue).toEpochMilli() } catch (e: Exception) { Long.MAX_VALUE }

                val candidate = SkillSummary(k, mastery, if (nextDue == "null") null else nextDue)

                if (best == null) best = candidate
                else {
                    // prefer overdue
                    val bestNext = best.nextDueIso?.let { try { java.time.Instant.parse(it).toEpochMilli() } catch (e: Exception) { Long.MAX_VALUE } } ?: Long.MAX_VALUE
                    if (nextDueTs <= now && bestNext > now) {
                        best = candidate
                    } else if (nextDueTs <= now && bestNext <= now) {
                        // both overdue: pick more overdue (smaller nextDueTs)
                        if (nextDueTs < bestNext) best = candidate
                    } else if (best.mastery > mastery) {
                        best = candidate
                    }
                }
            }
            return best
        } catch (e: Exception) {
            return null
        }
    }
}
