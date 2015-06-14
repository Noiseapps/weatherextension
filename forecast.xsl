<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/weatherdata">
        <div class="row">
            <hr/>
            <table class="hoverable">
                <tr><th>Forecast for the next 6 days:</th></tr>
            </table>
                <xsl:for-each select="forecast/time">
                    <div class="col s2">
                        <b>
                        <xsl:value-of select="@day">
                        </xsl:value-of></b>
                        <br />
                        <img id="forecast{position()}" src="" title="{symbol/@name}"/>
                        <br />
                        <b><xsl:value-of select="format-number(temperature/@day, '#')">
                        </xsl:value-of>°C
                        </b>
                        <br />
                        <xsl:value-of select="pressure/@value" />
                        &#160; <!-- nbsp  -->
                        <xsl:value-of select="pressure/@unit" />
                        <br />
                        <xsl:value-of select="windSpeed/@mps"/> m/s
                        [<xsl:value-of select="windDirection/@name"/>]

                    </div>
                </xsl:for-each>
        </div>
    </xsl:template>

</xsl:stylesheet>