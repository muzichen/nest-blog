import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

export function MongooseInterceptor(
  plainToInteceptor: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    handleResponse(document: PlainLiteralObject | Document) {
      if (!(document instanceof Document)) {
        // 如果document不是mongoose的Document类型，则直接返回
        return document;
      }
      return plainToClass(plainToInteceptor, document.toJSON());
    }

    transfromToObject(
      response: PlainLiteralObject | Array<PlainLiteralObject>,
    ): PlainLiteralObject | Array<PlainLiteralObject> {
      console.log(response, response instanceof Document);
      if (Array.isArray(response)) {
        return response.map(this.handleResponse);
      }
      return this.handleResponse(response);
    }

    serialize(
      response: PlainLiteralObject | Array<PlainLiteralObject>,
      options: ClassTransformOptions,
    ) {
      console.log('xxxxxxxxx');
      return super.serialize(this.transfromToObject(response), options);
    }
  };
}
