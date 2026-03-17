export type BannerImageType = {
    id: number;
    image: string | null;
    text: string;
    redirection_link: string | null;
    view_counter: number;
    click_counter: number;
    created_by: number;
    created_at: string; // ou `Date` si tu les transformes à l'import
    updated_at: string; // ou `Date`
    deleted_at: string | null; // ou `Date | null`
};

export type BannerTextType = {
    id: number;
    slug: string;
    title: string | null;
    text: string;
    redirection_link: string | null;
    view_counter: number;
    click_counter: number;
    created_by: number | null;
    created_at: string; // ou Date si tu convertis avec new Date()
    updated_at: string;
    deleted_at: string | null;
};

export type BrandType = {
    id: number;
    name: string;
    slug: string;
    logo: string;
    picture: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type CategoryType = {
    picture: string;
    id: number | null;
    name: string;
    created_by: number;
    created_at: string; // ISO date
    updated_at: string; // ISO date
};

export type ShapeType = {
    picture: string;
    id: number | null;
    name: string;
    created_by: number;
    created_at: string; // ISO date
    updated_at: string; // ISO date
};

export type ServiceType = {
    picture: string | null;
    id: number;
    slug: string;
    name: string;
    price: number | null;
    short_description: string;
    full_description: string;
    created_by: number;
    created_at: string; // ou Date si tu veux le parser
    updated_at: string; // idem
    deleted_at: string | null;
};

export type FrameType = {
    picture: string;
    id: number;
    name: string;
    created_by: number;
    created_at: string; // ou Date si tu veux le parser
    updated_at: string; // idem
    deleted_at: string | null;
};

export type NewsType = {
    photo: string | null;
    id: number;
    slug: string;
    title: string;
    short_description: string;
    description: string; // HTML
    created_by: number;
    created_at: string; // ou Date
    updated_at: string;
    deleted_at: string | null;
};

export type ProductImageType = {
    image_url: string;
    id: number;
    product_id: number;
    color: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    deleted_at: string | null;
};

export type ProductType = {
    id: number;
    name: string;
    slug: string;
    price: number;
    ref: string;
    size: string;
    quantity: number;
    description: string|"";
    frame_id: number;
    genre: number;
    color: string;
    dimension: DimensionType;
    is_prestige: boolean;
    brand_id: number;
    shape_id: number;
    category_id: number;
    is_famous: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    images: ProductImageType[];
    brand: BrandType;
    frame: FrameType;
    shape: ShapeType;
    category: CategoryType;
    size_details ?: SizeType | null;
    super_categories: string;
    accessories_category: number;
    promotion_price: number;
    accessoriesCategory: CategoryType;
    manufacturd_description: string;
};


export type OpeningHourType = {
    id: number;
    shop_id: number;
    day: string;          // ex: "Mardi"
    open_at: string;      // format: "HH:mm:ss"
    closed_at: string;    // format: "HH:mm:ss"
    created_by: number;
    created_at: string;   // ISO date
    updated_at: string;   // ISO date
    deleted_at: string | null;
};

export type ShopServiceType = {
    shop_id: number;
    service_id: number;
    created_at: string;   // ISO date
    updated_at: string;   // ISO date
    service: ServiceType;
};

export type ShopType = {
    picture: string | null;
    video: string | null;
    id: number;
    slug: string;
    name: string;
    short_description: string;
    phone1: string | null;
    phone2: string | null;
    address: string | null;
    longitude: string | null;
    latitude: string | null;
    whatsapp1: string | null;
    whatsapp2: string | null;
    email: string | null;
    created_by: number;
    created_at: string;   // ISO date
    updated_at: string;   // ISO date
    deleted_at: string | null;
    shopServices: ShopServiceType[];
    opening_hours: OpeningHourType[];
};

export type FaqType = {
    id: number;
    question: string;
    answer: string; // HTML string
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    deleted_at: string | null; // peut être null si non supprimé
};

export type PartnerType = {
    id: number
    name: string
    link: string
    type: string
    logo?: string | null
    banner?: string | null
}

export type AppointmentType = {
    id: number;
    more_detail: {
        hello: string;
        nom: string;
    };
    reference: string;
    start_time: string; // ISO date string
    end_time: string;   // ISO date string
    status: number;
    canceled_motif: string | null;
    validated_by: number | null;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string

    shop: {
        name: string;
        address: string;
    };

    service: {
        name: string;
        price: number;
    };

    user: {
        lastname: string;
        firstname: string;
        phone: string;
        email: string;
    };

    canceledBy: null | {
        id: number;
        lastname: string;
        firstname: string;
    };

    validatedBy: null | {
        id: number;
        lastname: string;
        firstname: string;
    };
};

export type EventTarget = {
    id: number
    event_id: number
    target_id: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export type EventType = {
    id: number
    ref: string
    name: string
    description: string
    address: string
    google_map_url: string
    longitude: number | null
    latitude: number | null
    date_from: string
    date_to: string
    photo: string | null
    custom_author: string | null
    custom_author_photo: string | null
    created_by: number
    created_at: string
    updated_at: string
    deleted_at: string | null
    target: EventTarget[]
}

export type OfferType = {
    id: number
    title: string
    description: string
    slug: string
    image?: string | null
    valid_from: string // format: "YYYY-MM-DD HH:mm:ss"
    expired_at: string // format: "YYYY-MM-DD HH:mm:ss"
    categorie: number
    code: string
    discount: number
    client_types_target: number
    gender_types_target: number
    created_by: number
    created_at: string
    updated_at: string
    deleted_at: string | null
    category?: CategoryType
}

export type ColorType = {
    id: number
    name: string
    code: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export type DimensionType = {
    lens_width: number;
    lens_height: number;
    bridge_width: number;
    temple_length: number;
    frame_width: number;
};

export type SizeType = {
    id: number;
    name: string;
};

export interface OrdersResponse {
    pagination: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
    };
    list: Order[];
}

export interface Order {
    id: number;
    reference: string;
    user_id: number;
    amount: number;
    discount: number;
    total_amount: number;
    status: number;
    created_at: string;
    updated_at: string;
    more_details: OrderMoreDetails;
    user: OrderUser;
    order_products: OrderProduct[];
    order_deliveries: OrderDelivery[];
    order_status: OrderStatus;
}

export interface OrderMoreDetails {
    client_fullmane: string;
    client_email: string;
    client_phone: string;
    client_city: string;
    client_country: string;
    client_postal_code: string;
}

export interface OrderUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}

export interface OrderProduct {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    discount: number;
    final_amount: number;
    picture: string;
}

export interface OrderDelivery {
    id: number;
    price: number;
    from: string;
    destination: string;
}

export interface OrderStatus {
    id: number;
    slug: string;
    label: string;
    is_visible: boolean;
}


export type GlassSizeType = {
  id: number;
  name: string;
};

export interface RolesAdminType {
  id: number;
  title: string;
  description: string | null;
  icon: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CommentType = {
  id: number;
  type: number;
  item_id: number;
  user_id: number;
  message: string;
  finale_message: string | null;
  status: number;
  validated_by: number | null;
  validated_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    fullname: string | null;
    avatar: string | null;
    email: string;
  };
  commentType:CommentsArticleType
};

interface CommentsArticleType {
  id: number;
  slug: string;
  label: string;
}

