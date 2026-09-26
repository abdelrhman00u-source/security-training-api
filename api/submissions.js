import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();

        // استخراج البيانات بالمسميات الجديدة المطابقة لتطبيق الأندرويد
        const {
            username,
            video_reference,
            link_status,
            media_url
        } = body;

        if (!username || username.trim() === "") {
            return Response.json(
                { success: false, message: "اسم المستخدم مطلوب" },
                { status: 400 }
            );
        }

        // إدخال البيانات إلى جدول submissions في Supabase
        const { data, error } = await supabase
            .from("submissions")
            .insert({
                username: username.trim(),
                video_reference: video_reference?.trim() || null,
                link_status: link_status || "يعمل",
                media_url: media_url?.trim() || null
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            return Response.json(
                { success: false, message: "تعذر حفظ البيانات، حاول مرة أخرى" },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: "تم إرسال التقرير بنجاح",
            data
        });

    } catch (error) {
        console.error("API Error:", error);
        return Response.json(
            { success: false, message: "تعذر الاتصال بالخادم" },
            { status: 500 }
        );
    }
}
