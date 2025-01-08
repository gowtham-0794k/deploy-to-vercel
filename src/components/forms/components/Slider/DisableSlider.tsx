"use client";
import React from "react";
import Slider from "@mui/material/Slider";

export default function DisableSlider() {
  const [value, setValue] = React.useState<number | number[]>(35);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue);
  };

  return (
    <Slider
      disabled
      value={value}
      onChange={handleChange}
      aria-labelledby="continuous-slider"
    />
  );
}
