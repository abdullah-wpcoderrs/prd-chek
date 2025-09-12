import ProfileSettings from "@/components/ProfileSettings";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-sans">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600 mt-2 font-sans">
            Manage your profile and account preferences
          </p>
        </div>

        <ProfileSettings />
      </div>
    </main>
  );
}