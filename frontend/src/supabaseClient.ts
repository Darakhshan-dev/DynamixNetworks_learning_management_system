import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://vdbxwmjyuvluifxocdad.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYnh3bWp5dXZsdWlmeG9jZGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjQ2NzksImV4cCI6MjA3NzYwMDY3OX0.gGZMc0Qo5l7qsON1L5I3gcD4TyHLeVPEt0zucojH8iA"
export const supabase = createClient(supabaseUrl, supabaseKey)
