interface MainTitleProps {
  heading: string;
  subHeading?: string;
  isPill?: boolean;
}

const MainTitle: React.FC<MainTitleProps> = ({ heading, subHeading, isPill }) => {
  return (
    <div>
      <div className="text-4xl font-medium">{heading}</div>
      {isPill ? (
        <div className="mt-3 mb-10 border rounded-full w-fit px-3 py-1 text-sm hover:bg-border cursor-pointer">{subHeading}</div>
      ) : (
        <div className="text-base mt-3 mb-10">{subHeading}</div>
      )}
    </div>
  );
};

export default MainTitle;
