import SignUpForm from "@/components/auth/SignUpForm";

const SignUpPage = () => {
  return (
    <main className="auth-main flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </main>
  );
};

export default SignUpPage;