
export interface ErrorPageProps {
  status?: number;
  message?: string;
}

export default function ErrorPage ({ 
    status=404,   
    message="This page could not be found." 
  }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBF8F1] px-6 text-center">
      <div className="flex">
        <p className="font-serif text-3xl text-primary border-r-3 pr-5 mr-5">{status}</p>
        <div className="flex items-center text-base font-medium text-primary">{message}</div>
      </div>
    </div>
  );
}
