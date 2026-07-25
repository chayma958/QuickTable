-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItemIngredient" DROP CONSTRAINT "MenuItemIngredient_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItemIngredient" DROP CONSTRAINT "MenuItemIngredient_menuItemId_fkey";

-- DropTable
DROP TABLE "InventoryItem";

-- DropTable
DROP TABLE "MenuItemIngredient";

