
import { createClient } from '@supabase/supabase-js';

// In a production environment, these would be stored in environment variables
// For this demo, we're using the provided keys directly
const supabaseUrl = 'https://ayftvexwjcarollvwunn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZnR2ZXh3amNhcm9sbHZ3dW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTczNTIsImV4cCI6MjA2MDgzMzM1Mn0.--vId-EZi7Zl1K4-csYdxtacpqCVwM7zhf57GYedlHo';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
