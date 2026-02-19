
interface HeaderProps {
  title: string;
  subTitle: string;
}

const Header = ({ title, subTitle }: HeaderProps) => {
  return (
    <header className="w-full flex flex-col items-center sm:items-start">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-500">{subTitle}</p>
    </header>
  )
}

export default Header