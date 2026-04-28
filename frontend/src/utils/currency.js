const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0
});

export const formatCurrency = (amount = 0) => `Rs. ${rupeeFormatter.format(Number(amount) || 0)}`;
