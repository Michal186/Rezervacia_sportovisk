export default function Reviews() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Recenzie</h2>

      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex align-items-center mb-3">
          <img src="https://i.imgur.com/WxNkKf5.jpeg" className="rounded-circle me-3" width="60" />
          <div>
            <strong>Zuzana K.</strong>
            <div>⭐⭐⭐⭐⭐</div>
          </div>
        </div>

        <p>
          „Skvelý rezervačný systém. Všetko je prehľadné a rýchle. Rezervácia ihriska mi trvala doslova pár sekúnd. 
          Odporúčam každému, kto nechce strácať čas telefonovaním.“
        </p>
      </div>
    </div>
  );
}
