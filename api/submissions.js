import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();

        // استخراج البيانات بنفس الأسماء التي يرسلها تطبيق الأندرويد بالضبط
        const {
            username,
            groupName,
            notes,
            videoReference,
            image_url // تم تعديل هذا المتغير ليطابق الأندرويد
        } = body;

        if (!username || username.trim() === "") {
            return Response.json(
                { success: false, message: "اسم المستخدم مطلوب" },
                { status: 400 }
            );
        }

        if (!groupName || groupName.trim() === "") {
            return Response.json(
                { success: false, message: "اسم المجموعة مطلوب" },
                { status: 400 }
            );
        }

        // إدخال البيانات إلى قاعدة بيانات Supabase
        const { data, error } = await supabase
            .from("submissions")
            .insert({
                username: username.trim(),
                group_name: groupName.trim(),
                notes: notes?.trim() || null,
                video_reference: videoReference?.trim() || null, // حفظ رابط الفيديو إن وُجد
                image_url: image_url?.trim() || null             // حفظ رابط الصورة إن وُجدت
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
            message: "تم إرسال البيانات والميديا بنجاح",
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
