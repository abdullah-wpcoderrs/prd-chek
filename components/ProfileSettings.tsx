"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/hooks/useAuth"
import { User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react"
import EmailVerification from "@/components/EmailVerification"

export default function ProfileSettings() {
  const { user, updateProfile, changePassword } = useAuth()
  
  // Profile form state
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileMessage, setProfileMessage] = useState("")
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    if (user) {
      setEmail(user.email || "")
      setDisplayName(user.user_metadata?.display_name || "")
      setEmailVerified(user.email_confirmed_at ? true : false)
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) return

    setProfileLoading(true)
    setProfileError("")
    setProfileMessage("")

    try {
      const { error } = await updateProfile({
        data: { display_name: displayName }
      })

      if (error) {
        setProfileError(error.message)
      } else {
        setProfileMessage("Profile updated successfully!")
        setTimeout(() => setProfileMessage(""), 3000)
      }
    } catch (err) {
      setProfileError("Failed to update profile")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) return

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    setPasswordLoading(true)
    setPasswordError("")
    setPasswordMessage("")

    try {
      const { error } = await changePassword(newPassword)

      if (error) {
        setPasswordError(error.message)
      } else {
        setPasswordMessage("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setPasswordMessage(""), 3000)
      }
    } catch (err) {
      setPasswordError("Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Please sign in to manage your profile.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Email Verification Status */}
      <EmailVerification user={user} />
      
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {profileError}
            </div>
          )}

          {profileMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {profileMessage}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-50"
                />
                {emailVerified ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Verified
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Email changes require verification. Contact support to update your email.
              </p>
            </div>

            <Button
              type="submit"
              disabled={profileLoading || !displayName.trim()}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Password Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <CardTitle>Password & Security</CardTitle>
          </div>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {passwordError}
            </div>
          )}

          {passwordMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {passwordMessage}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            {/* Password strength indicator */}
            {newPassword && (
              <div className="space-y-2">
                <Label className="text-sm">Password Strength</Label>
                <div className="flex gap-1">
                  <div className={`h-2 w-full rounded ${
                    newPassword.length >= 6 ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                  <div className={`h-2 w-full rounded ${
                    newPassword.length >= 8 && /[A-Z]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                  <div className={`h-2 w-full rounded ${
                    newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={newPassword.length >= 6 ? 'text-green-600' : ''}>
                    ✓ At least 6 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                    ✓ Contains uppercase letter
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                    ✓ Contains number
                  </li>
                </ul>
              </div>
            )}

            <Button
              type="submit"
              disabled={passwordLoading || !newPassword || !confirmPassword}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View your account details and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs text-gray-500">User ID</Label>
              <p className="font-mono text-xs bg-gray-50 p-2 rounded">
                {user.id}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Account Created</Label>
              <p className="text-sm">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Last Sign In</Label>
              <p className="text-sm">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Email Confirmed</Label>
              <p className="text-sm">
                {emailVerified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}