import { Prisma } from "@prisma/client";
import { Response } from "express";

export function handlePrismaErrors(error: unknown, res: Response): void {
  try {
    // if (error instanceof Error) {
    //   if (error instanceof HttpException) {
    //     throw error;
    //   }
    //   if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //     if (error?.code === `P2002`) {
    //       throw new HttpException(
    //         {
    //           success: false,
    //           error: `Unique constraint error: ${error?.meta?.target?.toString()}`,
    //         },
    //         HttpStatus.CONFLICT
    //       );
    //     } else if (error?.code === `P2003`) {
    //       throw new HttpException(
    //         {
    //           success: false,
    //           error: `Foreign key constraint error: ${
    //             error?.meta?.target?.toString() ?? ""
    //           }`,
    //         },
    //         HttpStatus.CONFLICT
    //       );
    //     } else if (error?.code === `P2025`) {
    //       throw new HttpException(
    //         {
    //           success: false,
    //           error: `Record not found: ${
    //             error?.meta?.target?.toString() ?? ""
    //           }`,
    //         },
    //         HttpStatus.NOT_FOUND
    //       );
    //     } else if (error?.code === `P2024`) {
    //       throw new HttpException(
    //         {
    //           success: false,
    //           error: `Record not found: ${
    //             error?.meta?.target?.toString() ?? ""
    //           }`,
    //         },
    //         HttpStatus.NOT_FOUND
    //       );
    //     } else if (error?.code === `P2016`) {
    //       throw new HttpException(
    //         {
    //           success: false,
    //           error: `Record not found: ${
    //             error?.meta?.target?.toString() ?? ""
    //           }`,
    //         },
    //         HttpStatus.NOT_FOUND
    //       );
    //     } else {
    //       throw new HttpException(
    //         {
    //           success: false,
    //           error: `Internal server error: ${error.message}`,
    //         },
    //         HttpStatus.INTERNAL_SERVER_ERROR
    //       );
    //     }
    //   } else if (error instanceof Prisma.PrismaClientValidationError) {
    //     throw new HttpException(
    //       {
    //         success: false,
    //         error: `Validation error occured: ${error.message}`,
    //       },
    //       HttpStatus.BAD_REQUEST
    //     );
    //   } else {
    //     throw new HttpException(
    //       {
    //         success: false,
    //         error: "Internal server error",
    //       },
    //       HttpStatus.INTERNAL_SERVER_ERROR
    //     );
    //   }
    // } else {
    //   throw new HttpException(
    //     {
    //       success: false,
    //       error: "Internal server error",
    //     },
    //     HttpStatus.INTERNAL_SERVER_ERROR
    //   );
    // }
  } catch (error) {
    // if (error instanceof HttpException) {
    //   throw error;
    // } else {
    //   throw new HttpException(
    //     {
    //       success: false,
    //       error: "Internal server error",
    //     },
    //     HttpStatus.INTERNAL_SERVER_ERROR
    //   );
    // }
  }
}
