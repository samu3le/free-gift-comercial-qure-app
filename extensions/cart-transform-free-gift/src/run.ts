import type {
  RunInput,
  FunctionRunResult,
  CartOperation
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  const operations = input.cart.lines.reduce(
    (acc: CartOperation[], cartLine) => {

      const updateOperation = optionallyBuildUpdateOperation(cartLine);

      console.log('line item for1', cartLine.quantity);

      if (updateOperation) {
        return [...acc, { update: updateOperation }];
      }

      return acc;
    },
    []
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
}

function optionallyBuildUpdateOperation(cartLine: RunInput['cart']['lines'][number]) {
  const { id: cartLineId, merchandise, productFree, quantity } = cartLine;

  if (
    merchandise.__typename === "ProductVariant" &&
    productFree && quantity === 1 && merchandise.isFreeValidated?.value
  ) {

    console.log('que es esto otro--->', merchandise.title);
    return {
      cartLineId,
      price: {
        adjustment: {
          fixedPricePerUnit: {
            amount: 0
          }
        }
      }
    };
  }

  return null;
}