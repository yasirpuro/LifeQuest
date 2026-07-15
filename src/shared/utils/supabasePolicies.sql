create policy if not exists profiles_select_policy on profiles for select using (true);
create policy if not exists profiles_update_policy on profiles for update using (auth.uid() = id);
create policy if not exists profiles_insert_policy on profiles for insert with check (auth.uid() = id);

create policy if not exists skills_progress_select_policy on skills_progress for select using (true);
create policy if not exists skills_progress_update_policy on skills_progress for update using (auth.uid() = user_id);
create policy if not exists skills_progress_insert_policy on skills_progress for insert with check (auth.uid() = user_id);
