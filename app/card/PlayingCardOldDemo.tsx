export interface CardInfo {
  default: boolean;
  name: string;
  summary: string;
  ability1: string;
  ability2: string;
  specialattack: string;
  weakness: string;
  HP: number;
  topics: string[];
  svgPath: string;
}


type CardProps = CardInfo & { imageUrl: string };
const Card = (data: CardProps) => {
  const {
    name,
    summary,
    imageUrl,
    svgPath,
    HP,
    ability1,
    ability2,
    specialattack,
    weakness,
    topics
  } = data;
  return (
    <div className="bg-yellow-400 w-[350px] h-[490px] rounded-xl m-2 p-3 flex justify-center items-center">
      <div className="bg-gradient-to-br from-slate-300 to-slate-300 via-slate-400 w-full h-full  flex flex-col items-center gap-1">
        <div className="flex flex-col items-center w-full px-5">
          {/* Top bar with HP and type */}
          <div className="flex justify-between w-full h-fit mt-1 items-end">
            <div className="font-bold text-xl">{name}</div>
            <div className="flex h-full gap-1 ">
              <div
                className=" text-gray-700 text-base tooltip-top tooltip z-20 flex"
                data-tip="Hacker Points"
              >
                {HP} HP
              </div>
              <img
                className="h-[20px] aspect-square object-cover bg-slate-200 rounded-full"
                src={svgPath}
                alt="file type"
              />
            </div>
          </div>
          {/* Portrait */}
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-700 to-yellow-400 p-2 w-full aspect-[5/4] object-cover overflow-hidden relative ">
            <img
              className="relative inset-0 z-10 object-cover h-full w-full"
              src={imageUrl}
              alt={name}
            />
            <div className="absolute inset-0 z-0 w-[20%] h-[200%] bg-gradient-to-r from-transparent via-yellow-100 to-transparent  animate-flash"></div>
          </div>
        </div>
        {/* Under Potrait */}
        <div className="flex flex-col items-center w-full h-full px-3">
          <div className="flex flex-col justify-between h-full">
            {/* Below Portrait top
             */}
            <div>
              <div className="border-4 border-slate-600 bg-gradient-to-br from-yellow-500 to-yellow-500 via-yellow-100 p-1 text-xs">
                <b>Summary:</b> {summary}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <p className="text-gray-700 bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400 border rounded rounded-xs border-slate-800 p-1 text-xs ">
                  <b>Ability 1:</b> {ability1}
                </p>
                <p className="text-gray-700 bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400 border rounded rounded-xs border-slate-800 p-1 text-xs ">
                  <b>Ability 2:</b> {ability2}
                </p>
                <p className="text-gray-700 bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400 border rounded rounded-xs border-slate-800 p-1 text-xs ">
                  <b>Special Attack:</b> {specialattack}
                </p>
              </div>
            </div>
            {/* Below Portrait bottom */}
            <div className="flex justify-between text-xs">
              <p className="text-gray-700">
                <b>Str:</b> {topics.join(", ")}
              </p>
              <p className="text-gray-700">
                <b>Wk:</b> {weakness}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
