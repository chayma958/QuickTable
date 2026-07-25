const RUN_TAG = Date.now().toString(36);

export function uniqueSuffix(): string {
  return `${RUN_TAG}-${Math.floor(Math.random() * 10000)}`;
}

export function uniqueCustomerName(): string {
  return `E2E Customer ${uniqueSuffix()}`;
}

export function uniqueDishName(): string {
  return `E2E Test Dish ${uniqueSuffix()}`;
}

export function uniquePhone(): string {
  const digits = Date.now().toString().slice(-9);
  return `+1555${digits}`;
}
