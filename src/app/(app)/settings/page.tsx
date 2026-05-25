'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth/actions'

export const dynamic = 'force-dynamic'

const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  muted: '#71717a',
  dim: '#3f3f46',
  accent: '#007AFF',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#f87171',
}

interface ProfileData {
  full_name: string
  email: string
}

interface OrganizationData {
  name: string
  plan?: 'basic' | 'pro' | 'enterprise'
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Form states
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email, org_id')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile({
            full_name: profileData.full_name || '',
            email: profileData.email || user.email || '',
          })
          setFullName(profileData.full_name || '')

          // Fetch organization
          if (profileData.org_id) {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('name, plan')
              .eq('id', profileData.org_id)
              .single()

            if (orgData) {
              setOrganization({
                name: orgData.name || '',
                plan: orgData.plan || 'basic',
              })
              setCompanyName(orgData.name || '')
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 2000)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error
      showSuccess('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()

      if (!profileData?.org_id) throw new Error('Organization not found')

      const { error } = await supabase
        .from('organizations')
        .update({ name: companyName })
        .eq('id', profileData.org_id)

      if (error) throw error
      showSuccess('Organization updated successfully')
    } catch (error) {
      console.error('Error saving organization:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setIsSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user?.email) return

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        setPasswordError('Current password is incorrect')
        setIsSaving(false)
        return
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showSuccess('Password updated successfully')
    } catch (error) {
      console.error('Error updating password:', error)
      setPasswordError('Failed to update password')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOutEverywhere = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut({ scope: 'global' })
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', minHeight: '100vh' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: `2px solid ${colors.accent}`,
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    )
  }

  const getPlanBadgeStyle = (plan?: string) => {
    switch (plan) {
      case 'pro':
        return {
          bg: 'rgba(0,122,255,0.1)',
          border: 'rgba(0,122,255,0.2)',
          text: colors.accent,
        }
      case 'enterprise':
        return {
          bg: 'rgba(245,158,11,0.1)',
          border: 'rgba(245,158,11,0.2)',
          text: colors.amber,
        }
      default:
        return {
          bg: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.1)',
          text: colors.muted,
        }
    }
  }

  const planBadge = getPlanBadgeStyle(organization?.plan)

  return (
    <div style={{ padding: '36px 40px', maxWidth: '680px' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text, margin: 0, marginBottom: '4px' }}>
        Settings
      </h1>
      <p style={{ fontSize: '13px', color: colors.dim, margin: 0, marginBottom: '32px' }}>
        Manage your account and organization
      </p>

      {/* Success message */}
      {successMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: colors.green,
            fontSize: '13px',
            marginBottom: '20px',
            padding: '12px 16px',
            backgroundColor: 'rgba(16,185,129,0.1)',
            borderRadius: '8px',
            animation: 'fadeOut 2s forwards',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* SECTION 1 — Profile */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '14px',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#e4e4e7', margin: 0, marginBottom: '20px' }}>
          Profile
        </h2>

        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.accent}, #0ea5e9)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}
          >
            {fullName.split(' ')[0]?.[0]?.toUpperCase()}{fullName.split(' ')[1]?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#e4e4e7' }}>
              {fullName || 'Your Name'}
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: colors.dim }}>
              {profile?.email}
            </p>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: colors.accent,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '6px',
                padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0071e3'}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.accent}
            >
              Change photo (coming soon)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: '8px',
                color: colors.text,
                fontSize: '14px',
                transition: 'border-color 150ms ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: `1px solid rgba(255,255,255,0.05)`,
                borderRadius: '8px',
                color: colors.muted,
                fontSize: '14px',
                cursor: 'not-allowed',
              }}
            />
            <p style={{ fontSize: '11px', color: colors.dim, margin: 0, marginTop: '4px' }}>
              Email cannot be changed
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              alignSelf: 'flex-end',
              padding: '10px 18px',
              backgroundColor: colors.accent,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              marginTop: '8px',
            }}
            onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#0071e3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.accent)}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* SECTION 2 — Organization */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '14px',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#e4e4e7', margin: 0, marginBottom: '20px' }}>
          Organization
        </h2>

        <form onSubmit={handleSaveOrganization} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Company Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '6px' }}>
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: '8px',
                color: colors.text,
                fontSize: '14px',
                transition: 'border-color 150ms ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Plan */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '6px' }}>
              Current Plan
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  backgroundColor: planBadge.bg,
                  border: `1px solid ${planBadge.border}`,
                  borderRadius: '8px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  color: planBadge.text,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {organization?.plan || 'Basic'}
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: '12px',
                  color: colors.accent,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0071e3'}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.accent}
              >
                Upgrade plan
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              alignSelf: 'flex-end',
              padding: '10px 18px',
              backgroundColor: colors.accent,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              marginTop: '8px',
            }}
            onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#0071e3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.accent)}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* SECTION 3 — Change Password */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '14px',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#e4e4e7', margin: 0, marginBottom: '20px' }}>
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Current Password */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '6px' }}>
              Current Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '40px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderRadius: '8px',
                  color: colors.text,
                  fontSize: '14px',
                  transition: 'border-color 150ms ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: colors.muted,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '6px' }}>
              New Password (min. 8 characters)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '40px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderRadius: '8px',
                  color: colors.text,
                  fontSize: '14px',
                  transition: 'border-color 150ms ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: colors.muted,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {showNewPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a1a1aa', marginBottom: '6px' }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '40px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderRadius: '8px',
                  color: colors.text,
                  fontSize: '14px',
                  transition: 'border-color 150ms ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: colors.muted,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {passwordError && (
            <p style={{ fontSize: '12px', color: colors.red, margin: 0, marginTop: '-8px' }}>
              {passwordError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            style={{
              alignSelf: 'flex-end',
              padding: '10px 18px',
              backgroundColor: colors.accent,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              marginTop: '8px',
            }}
            onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#0071e3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.accent)}
          >
            {isSaving ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>

      {/* SECTION 4 — Danger Zone */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid rgba(248,113,113,0.15)`,
          borderRadius: '14px',
          padding: '28px',
        }}
      >
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: colors.red, margin: 0, marginBottom: '20px' }}>
          Danger Zone
        </h2>

        {/* Sign out everywhere */}
        <div style={{ paddingBottom: '20px', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
          <h3 style={{ fontSize: '13px', fontWeight: 500, color: '#e4e4e7', margin: 0, marginBottom: '4px' }}>
            Sign out of all devices
          </h3>
          <p style={{ fontSize: '12px', color: colors.dim, margin: 0, marginBottom: '12px' }}>
            You will be signed out everywhere
          </p>
          <button
            onClick={handleSignOutEverywhere}
            style={{
              padding: '8px 14px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.red}`,
              borderRadius: '8px',
              color: colors.red,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Sign out everywhere
          </button>
        </div>

        {/* Delete account */}
        <div style={{ paddingTop: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 500, color: '#e4e4e7', margin: 0, marginBottom: '4px' }}>
            Delete account
          </h3>
          <p style={{ fontSize: '12px', color: colors.dim, margin: 0, marginBottom: '12px' }}>
            Permanently delete your account and all data. This cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                padding: '8px 14px',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.red}`,
                borderRadius: '8px',
                color: colors.red,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Delete account
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder='Type "DELETE" to confirm'
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(248,113,113,0.2)`,
                  borderRadius: '6px',
                  color: colors.text,
                  fontSize: '12px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmInput('')
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: `1px solid rgba(255,255,255,0.1)`,
                    borderRadius: '6px',
                    color: colors.muted,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => alert('Contact support at support@nexhire.com to delete your account')}
                  disabled={deleteConfirmInput !== 'DELETE'}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: deleteConfirmInput === 'DELETE' ? colors.red : 'rgba(248,113,113,0.3)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: deleteConfirmInput === 'DELETE' ? 'pointer' : 'not-allowed',
                  }}
                >
                  Delete permanently
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
