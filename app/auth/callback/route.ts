import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")
  const origin = requestUrl.origin

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  try {
    const supabase = await createClient()
    
    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Session exchange error:", exchangeError)
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    // Get user after successful exchange
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("User fetch error:", userError)
      return NextResponse.redirect(`${origin}/auth/login?error=user_fetch_failed`)
    }

    // Create user profile if it doesn't exist
    const { data: existingProfile } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single()

    if (!existingProfile) {
      const username = user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`

      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        email: user.email!,
        username,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      })

      if (insertError) {
        console.error("Profile creation error:", insertError)
        // Don't fail the login, just log the error
      }
    }

    // Redirect to dashboard on success
    return NextResponse.redirect(`${origin}/dashboard`)
  } catch (err: any) {
    console.error("Unexpected callback error:", err)
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(err.message || "oauth_failed")}`)
  }
}

