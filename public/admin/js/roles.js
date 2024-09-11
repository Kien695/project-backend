//permission
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          // console.log(name);
          // console.log(index);
          // console.log(checked);
          // console.log("--------");
          if (checked) {
            // // Kiểm tra xem phần tử permissions[index] có tồn tại hay chưa
            // if (!permissions[index]) {
            //   permissions[index] = { id: null, permissions: [] }; // Khởi tạo phần tử mới nếu chưa tồn tại
            // }
            permissions[index].permissions.push(name);
          }
        });
      }
    });
    console.log(permissions);
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector(
        "#form-change-permission"
      );
      const inputPermissions = formChangePermissions.querySelector(
        "input[name='permissions']"
      );

      // Kiểm tra inputPermissions tồn tại trước khi gán giá trị
      if (inputPermissions) {
        inputPermissions.value = JSON.stringify(permissions);
        formChangePermissions.submit();
      } else {
        console.error("Phần tử input với name='permissions' không tồn tại.");
      }
    }
  });
}
//end permission

//permissions data default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("[table-permissions]");
  records.forEach((records, index) => {
    const permissions = records.permissions;
    permissions.forEach((permissions) => {
      const row = tablePermissions.querySelector(
        `[data-name="${permissions}"]`
      );
      const input = row.querySelectorAll("input")[index];
      input.checked = true;
    });
  });
}
//end permissions data default
