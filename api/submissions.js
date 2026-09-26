import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            username,
            groupName,
            notes,
            videoReference,
            imageUrl // استلام رابط الصورة (أو Base64)
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

        const { data, error } = await supabase
            .from("submissions")
            .insert({
                username: username.trim(),
                group_name: groupName.trim(),
                notes: notes?.trim() || null,
                video_reference: videoReference?.trim() || null,
                image_url: imageUrl?.trim() || null // حفظ رابط الصورة أو البيانات
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
            message: "تم إرسال البيانات والصورة بنجاح",
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
