"use client";
import { useState } from "react";

type User = {
  id: number;
  name: string;
  price: number;
};
const rawData: User[] = [
  { id: 1, name: "john", price: 50 },
  { id: 2, name: "ashley", price: 40 },
];

const Dashboard = () => {
  const [price, setPrice] = useState<number>(0);
  return (
    <div className="grid justify-center items-center grid-cols-3">
      {rawData.map((dt: User) => (
        <div className="flex items-center justify-center *:p-3" key={dt.id}>
          <div className="">{dt.name}</div>
          <button
            type="button"
            className=" bg-red-800 cursor-pointer hover:bg-white hover:text-red-800"
            onClick={() => setPrice((prev) => (prev += dt.price))}
          >
            กด
          </button>
          <p>result : {price}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
