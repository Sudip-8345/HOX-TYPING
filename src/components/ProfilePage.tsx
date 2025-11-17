import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  Clock,
  Translate,
  Camera,
  FloppyDisk,
  Trophy,
  Medal,
  Crown,
  Fire,
  Target,
  Lightning,
  CheckCircle,
  Star,
  Gear,
  Key,
  Trash,
  DeviceMobile,
  ShieldCheck,
  ClockCounterClockwise,
  SignOut,
  SquaresFour
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface UserProfile {
  photoUrl: string
  fullName: string
  username: string
  email: string
  phone: string
  bio: string
  country: string
  timezone: string
  languagePreference: 'english' | 'hindi' | 'both'
}

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  earnedDate?: number
  color: string
}

const defaultProfile: UserProfile = {
  photoUrl: '',
  fullName: '',
  username: '',
  email: '',
  phone: '',
  bio: '',
  country: 'India',
  timezone: 'Asia/Kolkata',
  languagePreference: 'both'
}

const badges: Badge[] = [
  {
    id: '50-tests',
    name: '50 Tests Champion',
    description: 'Complete 50 typing tests',
    icon: <Trophy size={32} weight="fill" />,
    earned: true,
    earnedDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    color: 'text-yellow-500'
  },
  {
    id: '7-day-streak',
    name: '7-Day Streak',
    description: 'Practice for 7 consecutive days',
    icon: <Fire size={32} weight="fill" />,
    earned: true,
    earnedDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
    color: 'text-orange-500'
  },
  {
    id: '100-wpm',
    name: '100 WPM Master',
    description: 'Achieve 100 words per minute',
    icon: <Lightning size={32} weight="fill" />,
    earned: false,
    color: 'text-blue-500'
  },
  {
    id: 'perfect-accuracy',
    name: 'Perfect Accuracy',
    description: 'Complete a test with 100% accuracy',
    icon: <Target size={32} weight="fill" />,
    earned: true,
    earnedDate: Date.now() - 14 * 24 * 60 * 60 * 1000,
    color: 'text-green-500'
  },
  {
    id: 'steno-beginner',
    name: 'Stenography Beginner',
    description: 'Complete your first stenography session',
    icon: <Medal size={32} weight="fill" />,
    earned: true,
    earnedDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    color: 'text-gray-400'
  },
  {
    id: 'steno-intermediate',
    name: 'Stenography Intermediate',
    description: 'Complete 25 stenography sessions',
    icon: <Medal size={32} weight="fill" />,
    earned: false,
    color: 'text-gray-300'
  },
  {
    id: 'steno-pro',
    name: 'Stenography Pro',
    description: 'Complete 100 stenography sessions',
    icon: <Crown size={32} weight="fill" />,
    earned: false,
    color: 'text-purple-500'
  },
  {
    id: 'hindi-master',
    name: 'Hindi Typing Master',
    description: 'Achieve 60 WPM in Hindi typing',
    icon: <Star size={32} weight="fill" />,
    earned: true,
    earnedDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    color: 'text-indigo-500'
  }
]

const countries = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Other'
]

const timezones = [
  { value: 'Asia/Kolkata', label: 'IST (Indian Standard Time)' },
  { value: 'America/New_York', label: 'EST (Eastern Time)' },
  { value: 'America/Los_Angeles', label: 'PST (Pacific Time)' },
  { value: 'Europe/London', label: 'GMT (Greenwich Mean Time)' },
  { value: 'Europe/Paris', label: 'CET (Central European Time)' },
  { value: 'Asia/Tokyo', label: 'JST (Japan Standard Time)' },
  { value: 'Australia/Sydney', label: 'AEST (Australian Eastern Time)' }
]

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useKV<UserProfile>('user-profile', {
    ...defaultProfile,
    email: user?.email || '',
    fullName: user?.name || '',
    username: user?.name || ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile || defaultProfile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleCancel = () => {
    setEditedProfile(profile || defaultProfile)
    setIsEditing(false)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, photoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const earnedBadges = badges.filter(b => b.earned)
  const lockedBadges = badges.filter(b => !b.earned)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} weight="bold" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <User size={24} weight="bold" className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                  <p className="text-xs text-muted-foreground">Manage your personal information</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="outline" className="gap-2">
                  <SquaresFour size={18} weight="bold" />
                  Dashboard
                </Button>
              </Link>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <FloppyDisk size={18} weight="bold" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Edit Info</TabsTrigger>
              <TabsTrigger value="achievements">Achievements & Badges</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>

            {/* Edit Info Tab */}
            <TabsContent value="info" className="space-y-6 mt-6">
              {/* Basic Profile Info */}
              <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={24} weight="bold" />
                Basic Profile Info
              </CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  {editedProfile.photoUrl ? (
                    <AvatarImage src={editedProfile.photoUrl} alt={editedProfile.fullName} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {getInitials(editedProfile.fullName || editedProfile.username || 'U')}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <div className="flex-1">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors w-fit">
                        <Camera size={20} weight="bold" />
                        <span className="text-sm font-medium">Upload Photo</span>
                      </div>
                    </Label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                )}
                {!isEditing && (
                  <div>
                    <h3 className="text-xl font-semibold">{profile?.fullName || 'Not set'}</h3>
                    <p className="text-sm text-muted-foreground">@{profile?.username || 'username'}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User size={18} weight="duotone" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={editedProfile.fullName}
                  onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User size={18} weight="duotone" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={editedProfile.username}
                  onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Choose a username"
                />
              </div>

              <Separator />

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <EnvelopeSimple size={18} weight="duotone" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  disabled={!isEditing}
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone size={18} weight="duotone" />
                  Phone <span className="text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+91 98765 43210"
                />
              </div>

              <Separator />

              {/* Bio / Description */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <User size={18} weight="duotone" />
                  Bio / Description
                </Label>
                <Textarea
                  id="bio"
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {editedProfile.bio.length} / 500 characters
                </p>
              </div>

              <Separator />

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <MapPin size={18} weight="duotone" />
                  Country
                </Label>
                {isEditing ? (
                  <Select
                    value={editedProfile.country}
                    onValueChange={(value) => setEditedProfile({ ...editedProfile, country: value })}
                  >
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={editedProfile.country} disabled />
                )}
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Clock size={18} weight="duotone" />
                  Timezone
                </Label>
                {isEditing ? (
                  <Select
                    value={editedProfile.timezone}
                    onValueChange={(value) => setEditedProfile({ ...editedProfile, timezone: value })}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={timezones.find((tz) => tz.value === editedProfile.timezone)?.label || editedProfile.timezone}
                    disabled
                  />
                )}
              </div>

              <Separator />

              {/* Language Preference */}
              <div className="space-y-2">
                <Label htmlFor="languagePreference" className="flex items-center gap-2">
                  <Translate size={18} weight="duotone" />
                  Language Preference
                </Label>
                {isEditing ? (
                  <Select
                    value={editedProfile.languagePreference}
                    onValueChange={(value) => setEditedProfile({ ...editedProfile, languagePreference: value as UserProfile['languagePreference'] })}
                  >
                    <SelectTrigger id="languagePreference">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="both">Both (English & Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={
                      editedProfile.languagePreference === 'english'
                        ? 'English'
                        : editedProfile.languagePreference === 'hindi'
                        ? 'हिंदी (Hindi)'
                        : 'Both (English & Hindi)'
                    }
                    disabled
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements & Badges Tab */}
        <TabsContent value="achievements" className="space-y-6 mt-6">
          {/* Achievements & Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy size={24} weight="bold" />
                Achievements & Badges
              </CardTitle>
              <CardDescription>
                Your accomplishments and milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statistics Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{earnedBadges.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Earned</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-muted-foreground">{lockedBadges.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Locked</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{Math.round((earnedBadges.length / badges.length) * 100)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Complete</p>
                </div>
              </div>

              <Separator />

              {/* Earned Badges */}
              {earnedBadges.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle size={20} weight="fill" className="text-success" />
                    Earned Badges
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {earnedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 rounded-lg border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-colors"
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className={badge.color}>
                            {badge.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{badge.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {badge.description}
                            </p>
                            {badge.earnedDate && (
                              <p className="text-xs text-success mt-2">
                                Earned {formatDate(badge.earnedDate)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {earnedBadges.length > 0 && lockedBadges.length > 0 && <Separator />}

              {/* Locked Badges */}
              {lockedBadges.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Medal size={20} weight="duotone" className="text-muted-foreground" />
                    Locked Badges
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {lockedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 rounded-lg border border-border bg-card/50 opacity-60 hover:opacity-80 transition-opacity"
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className="text-muted-foreground grayscale">
                            {badge.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{badge.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {badge.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              🔒 Not yet earned
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation Message */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Trophy size={24} weight="fill" className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Keep Going!</h4>
                    <p className="text-sm text-muted-foreground">
                      You're doing great! Complete more tests and maintain your streak to unlock more badges.
                      {lockedBadges.length > 0 && ` ${lockedBadges.length} more badge${lockedBadges.length > 1 ? 's' : ''} awaiting you!`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings Tab */}
        <TabsContent value="account" className="space-y-6 mt-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={24} weight="bold" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Change Email */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <EnvelopeSimple size={20} weight="bold" className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Change Email</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Update your email address for account notifications
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: <span className="font-medium">{profile?.email || user?.email}</span>
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Change email feature coming soon!')}>
                  Change
                </Button>
              </div>

              {/* Change Password */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Key size={20} weight="bold" className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Change Password</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Update your password to keep your account secure
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last changed: <span className="font-medium">30 days ago</span>
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Change password feature coming soon!')}>
                  Change
                </Button>
              </div>

              {/* Enable 2FA */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} weight="bold" className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add an extra layer of security to your account
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: <span className="font-medium text-orange-600">Not Enabled</span>
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('2FA setup coming soon!')}>
                  Enable
                </Button>
              </div>

              <Separator />

              {/* Logout */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <SignOut size={20} weight="bold" className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Logout</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sign out from your account on this device
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    logout()
                    navigate('/')
                    toast.success('Logged out successfully!')
                  }}
                  className="gap-2"
                >
                  <SignOut size={16} weight="bold" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockCounterClockwise size={24} weight="bold" />
                Account Activity
              </CardTitle>
              <CardDescription>
                Monitor your account access and connected devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Login History */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <ClockCounterClockwise size={20} weight="bold" className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Login History</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      View your recent login activity and locations
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last login: <span className="font-medium">Today at 10:30 AM</span>
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Login history feature coming soon!')}>
                  View
                </Button>
              </div>

              {/* Device Management */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <DeviceMobile size={20} weight="bold" className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Device Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage devices connected to your account
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active devices: <span className="font-medium">2 devices</span>
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Device management feature coming soon!')}>
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash size={24} weight="bold" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions - proceed with caution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <Trash size={20} weight="bold" className="text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-destructive">Delete Account</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Permanently delete your account and all associated data
                    </p>
                    <p className="text-xs text-destructive/80 mt-1 font-medium">
                      ⚠️ This action cannot be undone
                    </p>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => toast.error('Account deletion requires email confirmation. Feature coming soon!')}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 TypistPro India. Your profile is private and secure.</p>
        </div>
      </footer>
    </div>
  )
}
