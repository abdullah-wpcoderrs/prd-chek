import SignInForm from "@/components/auth/SignInForm";

const SignInPage = () => {
  return (
    <main className="auth-main flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </main>
  );
};

export default SignInPage;
