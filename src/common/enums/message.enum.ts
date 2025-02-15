export enum AuthMessage {
    LoggedIn = "شما با موفقیت وارد سیستم شدید ✅",
    LoggedOut = "شما با موفقیت خارج شدید",
    LoggedInRequired = "باید وارد سیستم شوید",
    IncorrectCode = "کد نادرست است ❌",
    ExpiredCode = "کد تایید منقضی شده است ❌"
}
export enum OtpMessage {
    Send = "کد یکبار مصرف ارسال شد ✅",
}

export enum CategoryMessage {
    AlreadyExist = "دسته بندی از قبل وجود دارد !",
    Created = "دسته بندی با موفقیت ایجاد شد ✅",
    Updated = "دسته بندی با موفقیت آپدیت شد ✅",
    Deleted = "دسته بندی با موفقیت حذف شد ❌",
    NotFound = "دسته بندی پیدا نشد ❌",
}

export enum SupplierMessage {
    AlredyExist = "فروشنده از قبل در سیستم ثبت شده ❌",
    SignUp = "اطلاعات فروشنده با موفقیت ثبت شد و در انتضار تایید میباشد✅",
    Update = "اطلاعات فروشنده با موفقیت بروزرسانی شد✅",
    NotFound = "حساب مورد نظر پیدا نشد ❌",
    NationalCodeUsed = "کد ملی قبلا استفاده شده ❌",
    EmailUsed = "ایمیل مورد نطر از قبل استفاده شده ❌",
    Uploaded = "اطلاعات مورد نظر با موفقیت آپلود شد ✅"
}