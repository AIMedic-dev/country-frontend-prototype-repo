const MessageUserCard = ({ message }: { message: string }) => {
  return (
    <div className="flex justify-end items-start space-x-2 pt-2 pb-2">
      <div className="break-words flex items-center  bg-blue-2 p-2 max-w-[80%] rounded-xl">
        {message}
      </div>
      <span
        style={{
          fontSize: '26px',
        }}
        className="material-icons text-blue-3 bg-blue-2/50 rounded-full p-1"
      >
        person
      </span>
    </div>
  );
};

export default MessageUserCard;
