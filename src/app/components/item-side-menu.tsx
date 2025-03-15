import { ItemSideMenuProps } from '@/resources/types/props';
const ItemSideMenu: React.FC<ItemSideMenuProps> = ({
  title,
  onClick,
  iconName,
  selected,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 w-full  ${
        selected
          ? 'bg-blue-1/40'
          : 'bg-blue-1/20 shadow-layout hover:bg-blue-1/30'
      } `}
    >
      <span className="material-icons text-blue-3 ">{iconName}</span>
      <span className="whitespace-nowrap">{title}</span>
    </button>
  );
};

export default ItemSideMenu;
