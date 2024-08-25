class BabySittingServiceData {
  final String id;
  final String? babysitterId;
  final String tutorId;
  final DateTime startDate;
  final DateTime endDate;
  final int value;
  final int childrenCount;
  final String address;

  const BabySittingServiceData({
    required this.id,
    required this.babysitterId,
    required this.tutorId,
    required this.startDate,
    required this.endDate,
    required this.value,
    required this.childrenCount,
    required this.address,
  });

  factory BabySittingServiceData.fromJson(Map<String, dynamic> json) {
    return BabySittingServiceData(
      id: json['id'],
      babysitterId: json['babysitterId'],
      tutorId: json['tutorId'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      value: json['value'],
      childrenCount: json['childrenCount'],
      address: json['address'],
    );
  }
}