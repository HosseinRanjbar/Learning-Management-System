export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      unitDisplay: "long",
      currency: "IRR"
    }).format(price);
  

  };
  
  