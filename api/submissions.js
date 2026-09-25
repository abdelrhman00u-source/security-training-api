import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            groupName,
            notes,
            videoReference
        } = body;

        if (!groupName) {
            return Response.json(
                {
                    success: false,
                    message: "اسم المجموعة مطلوب"
                },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("submissions")
            .insert({
                group_name: groupName,
                notes: notes || null,
                video_reference: videoReference || null
            })
            .select()
            .single();

        if (error) {
            console.error(error);

            return Response.json(
                {
                    success: false,
                    message: "حدث خطأ أثناء حفظ البيانات"
                },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: "تم حفظ البيانات بنجاح",
            data
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                message: "بيانات غير صحيحة"
            },
            { status: 400 }
        );
    }
}