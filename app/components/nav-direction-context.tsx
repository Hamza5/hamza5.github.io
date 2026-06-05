"use client";

import { createContext, useContext, useState } from "react";

type Direction = 1 | -1;

type NavDirectionContextType = {
  direction: Direction;
  setDirection: (d: Direction) => void;
};

const NavDirectionContext = createContext<NavDirectionContextType>({
  direction: 1,
  setDirection: () => {},
});

export const useNavDirection = () => useContext(NavDirectionContext);

export function NavDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [direction, setDirection] = useState<Direction>(1);
  return (
    <NavDirectionContext.Provider value={{ direction, setDirection }}>
      {children}
    </NavDirectionContext.Provider>
  );
}
