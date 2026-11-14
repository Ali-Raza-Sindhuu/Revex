export const getCarActions = (car, { onReserve, onTestDrive } = {}) => {
  if (car.status === "sold") {
    return {
      primary: { label: "Sold", disabled: true, onClick: undefined },
      secondary: null,
    };
  }
  if (car.listingType === "rent") {
    return {
      primary: { label: "Add rental to Garage", disabled: false, onClick: onReserve },
      secondary: null,
    };
  }
  return {
    primary: { label: "Add to Garage", disabled: false, onClick: onReserve },
    secondary: { label: "Book a test drive", disabled: false, onClick: onTestDrive },
  };
};
