import { supabase } from './supabaseClient';

const backendUrl = "http://localhost:3001";

// Fetch all users from Supabase
export async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

export async function registerUser(userData: {
  full_name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${backendUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Registration error:", errorText);
    throw new Error(errorText || "Registration failed");
  }
  return res.text();
}


// Login user via Express backend (with full backend URL)
export async function loginUser(credentials: { email: string; password: string }) {
  const res = await fetch(`${backendUrl}/api/login`, {   // Use backendUrl here
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json(); // Adjust if backend returns text
}
