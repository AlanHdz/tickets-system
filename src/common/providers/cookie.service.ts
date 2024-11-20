import { Injectable } from "@nestjs/common";
import { Response } from 'express';

@Injectable()
export class CookieService {

  async setCookie(res: Response, key: string, value: any, expiresHour?: number, httpOnly?: boolean) {

    const expires = new Date();
    expires.setTime(expires.getTime()+(expiresHour*60*60*1000));

    res.cookie(key, value, {
      expires: expires,
      httpOnly: httpOnly
    })

  }

}