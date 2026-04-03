import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";
export const alt = "BLOGIT article preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const logoMarkSvg = encodeURIComponent(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_2_2)">
    <path d="M0.894141 7.08776L2.05614 5.35076C2.16314 5.19276 2.23114 5.18876 2.34914 5.24476C4.90514 6.72076 7.19714 6.92976 9.56114 5.90676C11.9111 4.88776 13.3241 3.08676 14.0061 0.247756C14.0781 -0.00824395 14.1721 -0.00624393 14.2371 0.00275607L16.2671 0.442756C16.6101 0.528756 16.5971 0.622756 16.5891 0.692756C16.1391 4.02076 13.8341 6.94376 10.5701 8.32476C7.25314 9.75076 3.65014 9.43676 0.930141 7.48476C0.874141 7.43676 0.748141 7.30776 0.898141 7.08776H0.895141H0.894141ZM11.0091 23.8858L13.0901 23.9998C13.4401 24.0058 13.4501 23.9128 13.4591 23.8438C13.9091 20.5158 12.4601 17.0858 9.68014 14.8908C6.86014 12.6348 3.30214 11.9808 0.161141 13.1418C0.0961407 13.1748 -0.0608593 13.2648 0.0251407 13.5148L0.684141 15.4988C0.747141 15.6788 0.809141 15.7008 0.938141 15.6778C3.79314 14.9338 6.05814 15.3388 8.06614 16.9528C10.0621 18.5588 10.9461 20.6688 10.8501 23.5968C10.8531 23.8548 10.9431 23.8778 11.0081 23.8868L11.0091 23.8858ZM12.3441 10.0178C12.2514 10.0047 12.1578 9.99799 12.0641 9.99776C11.6421 9.99776 11.2441 10.1298 10.9181 10.3778C10.7186 10.5325 10.5517 10.7253 10.4272 10.945C10.3028 11.1648 10.2232 11.407 10.1931 11.6578C10.1231 12.1658 10.2531 12.6678 10.5551 13.0688C10.8601 13.4758 11.3141 13.7388 11.8321 13.8088C12.3346 13.8756 12.843 13.7405 13.2461 13.4331C13.6491 13.1257 13.9138 12.671 13.9821 12.1688C14.0187 11.9194 14.005 11.6652 13.942 11.4212C13.8789 11.1771 13.7677 10.9481 13.615 10.7477C13.4622 10.5472 13.2709 10.3793 13.0523 10.2538C12.8337 10.1282 12.5923 10.0477 12.3421 10.0168L12.3441 10.0178ZM22.7361 6.52476L21.7701 4.67476C21.6331 4.37076 21.5231 4.40076 21.4101 4.43876C18.3211 5.77076 16.1901 8.69876 15.7071 12.2768C15.2241 15.8568 16.5041 19.2498 19.1331 21.3518C19.1921 21.4038 19.2501 21.4218 19.3151 21.4168C19.3935 21.4081 19.4654 21.369 19.5151 21.3078L20.8731 19.6798C20.9981 19.5228 20.9441 19.4418 20.8791 19.3738C18.7491 17.2778 17.9531 15.1938 18.2991 12.6258C18.6481 10.0428 20.0091 8.19276 22.5851 6.79876C22.7891 6.67576 22.7551 6.57076 22.7361 6.52276V6.52476Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0_2_2">
      <rect width="24" height="24" rx="4" fill="white"/>
    </clipPath>
  </defs>
</svg>
`);

interface OgImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tags = (post.tags || []).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, #f6efe7 0%, #f3efe8 30%, #ece7de 58%, #ddd6ca 100%)",
          color: "#111111",
          fontFamily:
            '"SF Pro Display", "Geist", "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 64,
            bottom: -110,
            width: 300,
            height: 300,
            borderRadius: "9999px",
            border: "1px solid rgba(17,17,17,0.08)",
            background: "rgba(255,255,255,0.18)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "48px 56px 44px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(17,17,17,0.08)",
                boxShadow: "0 8px 24px rgba(17,17,17,0.08)",
              }}
            >
              <img
                src={`data:image/svg+xml;charset=utf-8,${logoMarkSvg}`}
                alt="BLOGIT"
                width="38"
                height="38"
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#111111",
                  color: "#ffffff",
                  padding: "7px 14px 8px",
                  borderRadius: 10,
                  fontSize: 24,
                  letterSpacing: "0.08em",
                  fontWeight: 800,
                }}
              >
                BLOGIT
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "rgba(17,17,17,0.48)",
                fontSize: 18,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 1,
                  background: "rgba(17,17,17,0.18)",
                }}
              />
              Article Preview
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              maxWidth: 980,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 16px",
                      borderRadius: 9999,
                      background: "rgba(255,255,255,0.72)",
                      border: "1px solid rgba(17,17,17,0.08)",
                      fontSize: 22,
                      color: "rgba(17,17,17,0.74)",
                    }}
                  >
                    #{tag}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(17,17,17,0.08)",
                    fontSize: 22,
                    color: "rgba(17,17,17,0.64)",
                  }}
                >
                  #Blogit
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 62,
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              {post.title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "rgba(17,17,17,0.5)",
              fontSize: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "9999px",
                  background: "#111111",
                }}
              />
              Built with Blogit
            </div>
            <div>{new Date(post.date).getFullYear()}</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
