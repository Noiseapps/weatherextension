<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <html>
            <body>
                <table border="1" class="hoverable">
                    <tr>
                        <th>Current weather conditions:</th>
                        <th>
                            <img id="weather_icon" src="" title="{current/weather/@value}"/>
                        </th>
                    </tr>
                    <tr>
                        <td>Temperature:</td>
                        <td>
                            <xsl:value-of select="format-number(current/temperature/@value - 273.15, '#.00')">
                            </xsl:value-of> °C
                        </td>
                    </tr>
                    <tr>
                        <td>Humidity:</td>
                        <td>
                            <xsl:value-of select="current/humidity/@value">
                            </xsl:value-of>%
                        </td>
                    </tr>
                    <tr>
                        <td>Pressure:</td>
                        <td>
                            <xsl:value-of select="current/pressure/@value">
                            </xsl:value-of> hPa
                        </td>
                    </tr>
                    <tr>
                        <td>Wind:</td>
                        <td>
                            <xsl:value-of select="current/wind/speed/@value">
                            </xsl:value-of> m/s,
                            [<xsl:value-of select="current/wind/direction/@name">
                            </xsl:value-of>]
                        </td>
                    </tr>
                    <tr>
                        <td>Cloud status:</td>
                        <td>
                            <xsl:value-of select="current/clouds/@name">
                            </xsl:value-of>
                        </td>
                    </tr>
                </table>
                <div class="right">Updated: <xsl:value-of select="current/lastupdate/@value"/></div>

            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>