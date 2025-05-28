import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <section className="w-screen h-screen bg-foreground sm:bg-background sm:flex sm:justify-center sm:items-center">
      <div className="bg-foreground sm:rounded p-7 sm:min-w-[550px]">
        <Image src={'/images/logo/icon.png'} alt="" height={1000000} width={1000000} className="w-20 h-12 mb-5 select-none" />
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
