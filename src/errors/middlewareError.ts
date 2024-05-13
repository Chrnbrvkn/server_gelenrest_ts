// import { Request, Response } from 'express';
// import { ApiError } from './ApiError';
// import { ErrorHandler} from './interfaceError';


// export const middlewareError = (err: ErrorHandler, req: Request, res: Response) => {

//   console.error(err);

//   if(err instanceof ApiError && err.status !== 500){
//     return res.status(err.status).json({
//       message: err.message
//     });
//   }
//   return res.status(500).json({
//     message: 'Internal Server Error'
//   });
// };