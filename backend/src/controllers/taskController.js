export const getAllTask = (request, responce) => {
    responce.status(200).send("Đã làm xong  20 công việc")
}

export const createTask = (request, responce) => {
    responce.status(201).send("Đã tạo thành công công việc")
}

export const updateTask = (request, responce) => {
    responce.status(201).send("Đã cập nhật thành công công việc")
}

export const deleteTask = (request, responce) => {
    responce.status(201).send("Đã xoá thành công công việc")
}