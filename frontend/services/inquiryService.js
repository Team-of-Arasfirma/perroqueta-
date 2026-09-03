const API_BASE =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const parseResponse = async (
  response
) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong."
    );
  }

  return data;
};

export const submitInquiry = async (
  inquiry
) => {
  const response = await fetch(
    `${API_BASE}/api/inquiries`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        inquiry
      ),
    }
  );

  return parseResponse(
    response
  );
};

export const fetchInquiries =
  async ({
    token,
    search = "",
    status = "",
    productInterest = "",
    page = 1,
    limit = 20,
  }) => {
    const params =
      new URLSearchParams();

    if (search) {
      params.set(
        "search",
        search
      );
    }

    if (status) {
      params.set(
        "status",
        status
      );
    }

    if (productInterest) {
      params.set(
        "productInterest",
        productInterest
      );
    }

    params.set(
      "page",
      String(page)
    );

    params.set(
      "limit",
      String(limit)
    );

    const response = await fetch(
      `${API_BASE}/api/inquiries?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return parseResponse(
      response
    );
  };

export const fetchInquiryById =
  async ({
    token,
    id,
  }) => {
    const response = await fetch(
      `${API_BASE}/api/inquiries/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return parseResponse(
      response
    );
  };

export const updateInquiryStatus =
  async ({
    token,
    id,
    status,
  }) => {
    const response = await fetch(
      `${API_BASE}/api/inquiries/${id}/status`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status,
        }),
      }
    );

    return parseResponse(
      response
    );
  };

export const deleteInquiry =
  async ({
    token,
    id,
  }) => {
    const response = await fetch(
      `${API_BASE}/api/inquiries/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return parseResponse(
      response
    );
  };