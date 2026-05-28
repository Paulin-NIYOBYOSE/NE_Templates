import {
  Controller,
  All,
  Req,
  Res,
  Headers,
  UseGuards,
  Logger,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  private getServiceUrl(service: string): string {
    switch (service) {
      case 'auth':
        return this.config.get('AUTH_SERVICE_URL') || 'http://localhost:3001';
      case 'items':
      case 'tags':
      case 'reports':
        return this.config.get('ITEMS_SERVICE_URL') || 'http://localhost:3002';
      default:
        throw new Error(`Unknown service: ${service}`);
    }
  }

  // Auth routes (public)
  @All('auth/*')
  async proxyAuth(@Req() req: Request, @Res() res: Response, @Headers() headers: any) {
    return this.proxyRequest('auth', req, res, headers);
  }

  @All('users/*')
  @UseGuards(JwtAuthGuard)
  async proxyUsers(@Req() req: Request, @Res() res: Response, @Headers() headers: any) {
    return this.proxyRequest('auth', req, res, headers);
  }

  // Items routes (protected)
  @All('items*')
  @UseGuards(JwtAuthGuard)
  async proxyItems(@Req() req: Request, @Res() res: Response, @Headers() headers: any) {
    return this.proxyRequest('items', req, res, headers);
  }

  @All('tags*')
  @UseGuards(JwtAuthGuard)
  async proxyTags(@Req() req: Request, @Res() res: Response, @Headers() headers: any) {
    return this.proxyRequest('items', req, res, headers);
  }

  @All('reports*')
  @UseGuards(JwtAuthGuard)
  async proxyReports(@Req() req: Request, @Res() res: Response, @Headers() headers: any) {
    return this.proxyRequest('items', req, res, headers);
  }

  @All('upload*')
  @UseGuards(JwtAuthGuard)
  async proxyUpload(@Req() req: Request, @Res() res: Response, @Headers() headers: any) {
    return this.proxyRequest('items', req, res, headers);
  }

  private async proxyRequest(
    service: string,
    req: Request,
    res: Response,
    headers: any,
  ) {
    const baseUrl = this.getServiceUrl(service);
    const path = req.path.replace('/api', '');
    const url = `${baseUrl}/api${path}`;

    this.logger.debug(`Proxying ${req.method} ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url,
          data: req.body,
          params: req.query,
          headers: {
            ...headers,
            host: undefined,
            'content-length': undefined,
          },
        }),
      );

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: error.message };
      return res.status(status).json(data);
    }
  }
}
