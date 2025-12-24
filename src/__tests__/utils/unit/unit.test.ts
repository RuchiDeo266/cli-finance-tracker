import { NextFunction, Request, Response } from "express";
import { generateSixDigitsCode } from "../../../utils/random-code-generator.ts";
import { asyncHandler } from "../../../utils/async-handler.ts";

describe.skip("Generate random six digit code integer", () => {
  it("should generate the 6-digit code", () => {
    const generateCode = generateSixDigitsCode();

    expect(typeof generateCode).toBe("number");
    expect(generateCode.toString()).toHaveLength(6);
  });
});

const flushPromises = () =>
  new Promise<void>((resolve) => setImmediate(resolve));

describe("Async Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Partial<Response>;
    mockNext = jest.fn();
  });

  it("Should handle async function : accepted response", async () => {
    const successMessage = { success: true, data: "test" };
    const asyncFunction = async (req: Request, res: Response) => {
      return res.json(successMessage);
    };

    const wrappedHandler = asyncHandler(asyncFunction); // asyncHandler returns a funtion.

    wrappedHandler(mockRequest as Request, mockResponse as Response, mockNext);

    // flush all the waiting tast from micro-queue
    await flushPromises();

    expect(mockResponse.json).toHaveBeenCalledWith(successMessage);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Should handle the async function : failed", async () => {
    const error = new Error("TestMessage : Error");
    const asyncFunction = async () => {
      await Promise.resolve();
      throw error;
    };

    const wrappedHandler = asyncHandler(asyncFunction);

    wrappedHandler(mockRequest as Request, mockResponse as Response, mockNext);

    await flushPromises();

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("Should pass synchronous function without fail", async () => {
    const fn = (_req: Request, _res: Response) => {
      (_res as Response).json({ ok: true });
      return 42; // non-promise
    };

    const wrapped = asyncHandler(fn);
    wrapped(mockRequest as Request, mockResponse as Response, mockNext);
    await flushPromises();

    expect(mockResponse.json).toHaveBeenCalledWith({ ok: true });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
