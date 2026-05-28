export interface Tag {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  isActive: boolean;
  createdById: string;
  createdBy?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  tags?: { tag: Tag }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  isActive?: boolean;
}

export interface UpdateItemDto extends Partial<CreateItemDto> {}

export interface PaginatedItems {
  data: Item[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
