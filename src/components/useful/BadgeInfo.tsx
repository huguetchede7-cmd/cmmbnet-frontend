import React from "react";

interface BadgeInfoProps {
  color?: string;            // couleur du badge (ex: "bg-green-500")
  label: string;             // ex: "Email", "Alerts"
  value?: string;            // valeur textuelle
  number?: number;           // valeur numérique optionnelle
  numberColor?: string;    // couleur de fond du nombre
}

const BadgeInfo: React.FC<BadgeInfoProps> = ({
                                               color = "bg-gray-400",
                                               label,
                                               value,
                                               number,
                                               numberColor = "bg-transparent text-gray-800",
                                             }) => {
  return (
    <div className="flex items-center justify-between rounded-lg">
      {/* Badge + Texte */}
      <div className="flex items-center space-x-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <div className="flex flex-col text-sm">
          <span className=" text-gray-700 ">{label}</span>
          {value && <span className="text-gray-600">{value}</span>}
        </div>
      </div>

      {/* Valeur numérique à droite */}
      {number !== undefined && (
        <span
          className={`px-1 py-0.5 rounded font-semibold text-xs  ${numberColor}`}
        >
          {number}
        </span>
      )}
    </div>
  );
};

export default BadgeInfo;
