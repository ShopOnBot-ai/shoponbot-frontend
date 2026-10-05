import { NextRequest, NextResponse } from "next/server";

export default async function proxy (request: NextRequest) {
    const token = request.cookies.get("access_token")
    const refreshToken = request.cookies.get("refresh_token")
    if(token || refreshToken){
        return NextResponse.next()
    }
    return NextResponse.redirect(
        new URL("/login", request.url)
    )
}

export const config = {
    matcher: ["/admin/:path*", "/onboarding","/cart", "/checkout"]
}
