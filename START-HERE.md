# ابدأ من هنا — Portfolio Codex Implementation Pack

يا Ya 7oss، دي الحزمة اللي هتستخدمها بنفس الـworkflow بتاعك: خطة كاملة، مراحل منفصلة، وPrompt جاهز لكل مرحلة. التصميم اللي وافقت عليه هو Studio Dark، والديموهات الأصلية لسه هتتنفّذ ضمن المراحل.

## تعمل إيه بالترتيب؟

1. اعمل فولدر/ريبو جديد للبورتفوليو، مثلًا `ahmed-portfolio`. متبدأش جوه أي ريبو من مشاريع العملاء.
2. فك `Ahmed_Hossam_Portfolio_Implementation_Pack.zip` جوه الفولدر. هتلاقي الخطة والـprompts في `docs/portfolio/` وملفات متابعة الشغل في الجذر.
3. فك `Studio_Dark_Reference.zip` في نفس الفولدر. هيتكوّن `design-reference/studio-dark/` وفيه كود المعاينة اللي وافقت عليها والـCV الحالي. ده مرجع الشكل؛ مفيهوش إعدادات استضافة الموقع التجريبي.
4. افتح الفولدر الجديد في Codex وخلّي عنده وصول قراءة للريبوهات الأربعة. الروابط موجودة في الخطة. لو الوصول مش متاح، وفّر نسخ محلية للقراءة؛ مفيش داعي لتشغيل الباك إند أو قواعد بيانات العملاء.
5. ابدأ برسالة البداية اللي تحت. بعدها استخدم Prompt واحد في كل مرة حسب `phase-roadmap.md`.

لو بتضيف الحزمة لريبو فيه شغل بالفعل، ادمج `AGENTS.md` وملفات الحالة بدل ما تمسح أي تعليمات أو شغل موجود.

## رسالة البداية الجاهزة

انسخ الرسالة دي إلى Codex بعد فك الملفين:

```text
We are implementing my personal software-engineering portfolio in this new repository.

Read AGENTS.md, STATE.md, DECISIONS.md, docs/portfolio/master-plan.md,
docs/portfolio/phase-roadmap.md, and docs/portfolio/design-spec.md.

The approved visual reference is in design-reference/studio-dark/.
Use it as the baseline. The four original client repositories are read-only references.

Execute docs/portfolio/prompts/00-audit.md now, and only that phase.
Do the actual audit and write its deliverables; do not replace execution with another generic plan.
Ask only for missing information that materially blocks this phase and cannot be obtained from the available files.
Update STATE.md and report the exit-gate evidence when done. Do not start Phase 01 automatically.
```

## هتمشي إزاي بعدها؟

لما Phase 00 تخلص ويتسجّل اللي اتراجع فعلًا، افتح `docs/portfolio/prompts/01-foundation.md` وانسخ محتواه. كرر ده مع باقي المراحل. ممكن بدل النسخ تقول لـCodex ينفّذ ملف الـprompt نفسه لو هو شايف ملفات الريبو.

متبعتش كل الـprompts مرة واحدة. كل مرحلة فيها المطلوب، حدود الشغل، وشروط اعتبارها خلصت. لو ظهر bug، استخدم `docs/portfolio/prompts/fix.md`؛ ولو نقلت لشات جديد، استخدم `docs/portfolio/prompts/resume.md`.

## أهم الملفات

| الملف | وظيفته |
| --- | --- |
| `docs/portfolio/master-plan.md` | الصورة الكاملة، نطاق الموقع، المعمارية، وتسليم الإنتاج |
| `docs/portfolio/design-spec.md` | قواعد Studio Dark، الأزرار، الخطوط، المسافات، والموبايل |
| `docs/portfolio/demo-spec.md` | إزاي ننقل الواجهات الأصلية ونشغّل السيناريوهات ببيانات تجريبية |
| `docs/portfolio/content-and-evidence.md` | معلومات الـCV والمشاريع، مصادرها، والحاجات اللي لسه مش مؤكدة |
| `docs/portfolio/acceptance-checklist.md` | اختبارات السلوك، الـUX، الـperformance، والاستضافة |
| `docs/portfolio/phase-roadmap.md` | ترتيب المراحل والنتيجة المطلوبة من كل واحدة |
| `docs/portfolio/prompts/` | 10 prompts للمراحل + استكمال الشغل + إصلاح مشكلة |
| `STATE.md` | إحنا فين فعلًا، إيه خلص وإيه متبقّي |
| `DECISIONS.md` | القرارات المتفق عليها والافتراضات التنفيذية |

## خليك واخد بالك من الحتة دي

أسهل جزء هنا هو البورتفوليو نفسه. الجزء اللي محتاج تدقيق هو إننا نطلع تجربة صغيرة شغالة من كل تطبيق أصلي؛ ده مش مجرد نسخ فولدر `frontend`. عشان كده بنعمل audit، وبعده أول demo حقيقية لـVertex، وبعدين نكرر الطريقة.

الأرقام الموجودة في معايير الأداء أهداف للتنفيذ والقياس، مش نتائج اختبارات حصلت بالفعل. وموقع المعاينة الخاص مش هو تلقائيًا اللينك العام اللي هيتحط في الـCV. النشر العام آخر مرحلة بعد اكتمال الشغل وتحديد الاستضافة والدومين.
