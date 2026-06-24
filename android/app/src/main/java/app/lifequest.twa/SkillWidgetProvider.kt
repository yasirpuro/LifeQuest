package app.lifequest.twa

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import app.lifequest.twa.R

class SkillWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        super.onUpdate(context, appWidgetManager, appWidgetIds)
        updateAll(context)
    }

    companion object {
        fun updateAll(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, SkillWidgetProvider::class.java)
            val ids = manager.getAppWidgetIds(thisWidget)
            if (ids.isEmpty()) return

            val focus = SkillBridge.getFocusSkill(context)
            for (id in ids) {
                val views = RemoteViews(context.packageName, R.layout.widget_skill)
                if (focus != null) {
                    views.setTextViewText(R.id.skill_name, focus.skillId)
                    views.setTextViewText(R.id.skill_mastery, "${focus.mastery}%")
                } else {
                    views.setTextViewText(R.id.skill_name, "Odak verisi yok")
                    views.setTextViewText(R.id.skill_mastery, "")
                }
                manager.updateAppWidget(id, views)
            }
        }
    }
}
