#pragma rtGlobals=3

Macro IgorPyramidScales()
	BuildPyramidScales()
End

Function BuildPyramidScales()
	String oldDF = GetDataFolder(1)
	NewDataFolder/O/S root:PyramidAtlas

	Make/O/N=8 lat = {29.9792,29.9761,19.6925,20.6829,17.222,41.8764,16.9365,43.9771}
	Make/O/N=8 lon = {31.1342,31.1308,-98.8438,-88.5686,-89.6237,12.4803,33.748,18.1769}
	Make/O/N=8 heights = {146.6,136.4,65,30,47,36.4,30,NaN}
	Make/O/T/N=8 labels = {"Guiza","Kefren","Sol","Castillo","Tikal","Cestio","Meroe","Bosnia"}

	Make/O/N=8 pairDistance
	Variable i
	for (i = 0; i < 7; i += 1)
		pairDistance[i] = PyramidDistance(lat[i], lon[i], lat[i + 1], lon[i + 1])
	endfor
	pairDistance[7] = NaN

	Display/K=1 heights
	ModifyGraph mode=3,marker=19
	SetAxis left 0,160
	Label left "Altura (m)"
	Label bottom "Sitio"
	ModifyGraph userticks(bottom)={labels,labels}
	DoWindow/C PyramidHeights

	Display/K=1 lon vs lat
	ModifyGraph mode=3,marker=19
	Label left "Latitud"
	Label bottom "Longitud"
	DoWindow/C PyramidGeoScatter

	Display/K=1 pairDistance
	ModifyGraph mode=3,marker=19
	Label left "Distancia al siguiente sitio (km)"
	Label bottom "Indice"
	DoWindow/C PyramidDistances

	SetDataFolder oldDF
End

Function PyramidDistance(lat1, lon1, lat2, lon2)
	Variable lat1, lon1, lat2, lon2
	Variable earthRadius = 6371.0088
	Variable dLat = (lat2 - lat1) * pi / 180
	Variable dLon = (lon2 - lon1) * pi / 180
	Variable rLat1 = lat1 * pi / 180
	Variable rLat2 = lat2 * pi / 180
	Variable a = sin(dLat / 2)^2 + cos(rLat1) * cos(rLat2) * sin(dLon / 2)^2
	return earthRadius * 2 * atan(sqrt(a) / sqrt(1 - a))
End
